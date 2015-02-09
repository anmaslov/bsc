# encoding: utf-8
class OrdersController < ApplicationController #protect_from_forgery with: :null_session
  include CurrentCart
  before_action :set_cart, only: [:new, :create, :update]
  before_action :set_order, only: [:show, :edit, :update, :destroy, :change_status]
  #before_action :authenticate_admin_user!, only: [:index]

  load_and_authorize_resource except: :create
  skip_authorize_resource :only => [:show, :new, :payment, :check_order, :payment_aviso, :success, :fail ]

  # GET /orders
  # GET /orders.json
  def index

    @status = params[:status]
    if @status.present?
      @orders = Order.where(:status => @status.to_i).order('updated_at ASC').paginate(:page => params[:page], :per_page => 30)
    else
      @orders = Order.order('updated_at DESC').paginate(:page => params[:page], :per_page => 30)
    end

    # <div role="tabpanel" class="tab-pane active" id="all_order">all_order</div>
    # <div role="tabpanel" class="tab-pane" id="adopted">adopted</div>
    # <div role="tabpanel" class="tab-pane" id="pending_payment">pending_payment</div>
    # <div role="tabpanel" class="tab-pane" id="paid">paid</div>
    # <div role="tabpanel" class="tab-pane" id="waiting_to_be_sent">waiting to be sent</div>
    # <div role="tabpanel" class="tab-pane" id="delivered">delivered</div>
    # <div role="tabpanel" class="tab-pane" id="canceled">canceled</div>
  end

  # GET /orders/1
  # GET /orders/1.json
  def show
    if current_user.id != @order.user_id and !(can? :manage, @order)
      redirect_to controller: "users", action: "orders", id: current_user.id, notice: "Это не ваш заказ :)"
    end


  end

  # GET /orders/new
  def new
    if @cart.line_items.empty?
      redirect_to store_url, notice: "Ваша корзина пуста"
      return
    end
    @order = Order.new
    @user = current_user
    @delivery_products = Product.where(:id => [29734, 29735])
    @line_item = LineItem.new
    @compare_item = CompareItem.new
  end

  # GET /orders/1/edit
  def edit
  end

  # POST /orders
  # POST /orders.json
  def create
    @order = Order.new(order_params)
    @order.add_line_items_from_cart(@cart)
    @order.user = current_user
    @order.status = 0

    respond_to do |format|
      error = false
      message = ''



      if params[:user].present? and params[:user][:password] != ''
        if params[:user][:password_confirmation] == params[:user][:password]
          User.create!({
               :email => @order.email,
               :password => params[:user][:password],
               :password_confirmation => params[:user][:password_confirmation],
               :name => @order.name,
               :address => @order.address,
               :phone => @order.phone
           })
        else
          error = true
          message = 'Пароли не совпадают'
          @order.errors[:registration] << message
        end
      elsif params[:order][:registration] == "" and params[:user][:password] == ""
        error = true
        message = 'Вы не заполнили пароль'
        @order.errors[:registration] << message
      end

      if error
        format.html { render action: 'new', notice: message }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      elsif @order.save
        OrderNotifier.received(@order).deliver
        OrderNotifier.report(@order).deliver
        Cart.destroy(session[:cart_id])

        # фиксируем цены в заказе
        @order.line_items.each do |line_item|
          line_item.price_fixed = line_item.product.price_with_margin current_user
          line_item.save
        end

        session[:cart_id] = nil



          if @order.pay_type != 'Банковской картой Visa/MasterCard'
            format.html { redirect_to store_url, notice: 'Спасибо за ваш заказ.' }
            format.json { render action: 'show', status: :created, location: @order }
          else
            @order.status = 1
            @order.save
            format.html { render action: 'payment' }
            format.json { render action: 'show', status: :created, location: @order }
          end
        end
        #@cart = current_cart
        @delivery_products = Product.where(:id => [29734, 29735])
        @line_item = LineItem.new
        @compare_item = CompareItem.new
        format.html { render action: 'new' }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
    end

  def payment

  end

  def check_order
    log = LoggerBd.new
    log.text = 'check_order start'
    log.save
    requestDatetime = params[:requestDatetime]
    action          = params[:action]
    md5             = params[:md5]
    shopId          = params[:shopId]
    shopArticleId   = params[:shopArticleId]
    invoiceId       = params[:invoiceId]
    customerNumber  = params[:customerNumber]
    orderCreatedDatetime = params[:orderCreatedDatetime]
    orderSumAmount  = params[:orderSumAmount]
    orderSumCurrencyPaycash = params[:orderSumCurrencyPaycash]
    orderSumBankPaycash     = params[:orderSumBankPaycash]
    shopSumAmount   = params[:shopSumAmount]
    shopSumCurrencyPaycash  = params[:shopSumCurrencyPaycash]
    shopSumBankPaycash      = params[:shopSumBankPaycash]
    paymentPayerCode        = params[:paymentPayerCode]
    paymentType             = params[:paymentType]

    orderNumber = params[:orderNumber]

    md5_string = 'checkOrder;' + orderSumAmount.to_s + ';' + orderSumCurrencyPaycash.to_s + ';' + orderSumBankPaycash.to_s + ';' +
        shopId.to_s + ';' + invoiceId.to_s + ';' + customerNumber.to_s + ';' + $shopPassword.to_s

    md5_new = Digest::MD5.hexdigest(md5_string).upcase


    log = LoggerBd.new
    log.text = 'check_order yandex md5: ' + md5.to_s
    log.save
    log = LoggerBd.new
    log.text = 'check_order bsc md5: ' + md5_new.to_s
    log.save

    #logger.debug "Person attributes hash"

    code = 0
    massage = 'Успешно'
    if md5 != md5_new
      code = 1
      massage = 'Ошибка авторизации'
    end

    log = LoggerBd.new
    log.text = 'check_order orderNumber: ' + orderNumber.to_s
    log.save

    if orderNumber.present?
      order = Order.find(orderNumber.to_i)
    elsif customerNumber.present?
      customerNumberTemp = customerNumber
      s = customerNumberTemp[0,1]
      customerNumberTemp[0] = ''
      if s == 'o'
        order = Order.find(customerNumberTemp.to_i)
      else
        user = User.find(customerNumberTemp.to_i)
        if user.present?
          order = user.orders.last(1)
        else
          order = nil
          code = 100
          massage = 'Отказ в приеме перевода. Пользователя не существует'
        end
      end
    else
      code = 200
      massage = 'Ошибка разбора запроса'
    end

    log = LoggerBd.new
    log.text = 'check_order 205: ' + code.to_s
    log.save

    #ts = order.total_price - orderSumAmount.to_f
    if order.present?
      order.performed_datetime = Time.now
      order.save
      requestDatetime = order.performed_datetime.strftime("%FT%T%:z")

      log = LoggerBd.new
      log.text = 'check_order requestDatetime: ' + requestDatetime
      log.save

      if order.total_price_in_stock - orderSumAmount.to_f < -1 or order.total_price_in_stock - orderSumAmount.to_f > 1
        code = 100
        massage = 'Отказ в приеме перевода. Суммы не совпадают'
        log = LoggerBd.new
        log.text = 'check_order total_price_in_stock: ' + order.total_price_in_stock.to_s
        log.save
        log = LoggerBd.new
        log.text = 'check_order orderSumAmount: ' + orderSumAmount.to_s
        log.save
        log = LoggerBd.new
        log.text = 'check_order total_price_in_stock - orderSumAmount: ' + (order.total_price_in_stock - orderSumAmount.to_f).to_s
        log.save
      end
    elsif code == 0
      code = 100
      massage = 'Отказ в приеме перевода. Заявка не найдена'
    end

    log = LoggerBd.new
    log.text = 'check_order code: ' + code.to_s + ' message: ' + massage
    log.save

    log = LoggerBd.new
    log.text = 'check_order code: ' + code.to_s
    log.save
    log = LoggerBd.new
    log.text = 'check_order massage: ' + massage
    log.save
    #Time.now.strftime("%FT%T%:z"),
    @request = {
        'performedDatetime' => requestDatetime,
        'code'              => code,
        'shopId'            => '29313',
        'orderSumAmount'    => orderSumAmount,
        'invoiceId'         => invoiceId,
        'message'           => massage
    }

    respond_to do |format|
      format.xml  { @request}
    end
  end

  def payment_aviso

    log = LoggerBd.new
    log.text = 'payment_aviso start'
    log.save

    requestDatetime = params[:requestDatetime]
    action          = params[:action]
    md5             = params[:md5]
    orderNumber     = params[:orderNumber]
    shopId          = params[:shopId]
    shopArticleId   = params[:shopArticleId]
    invoiceId       = params[:invoiceId]
    customerNumber  = params[:customerNumber]
    orderCreatedDatetime    = params[:orderCreatedDatetime]
    orderSumAmount          = params[:orderSumAmount]
    orderSumCurrencyPaycash = params[:orderSumCurrencyPaycash]
    orderSumBankPaycash     = params[:orderSumBankPaycash]
    shopSumAmount           = params[:shopSumAmount]
    shopSumCurrencyPaycash  = params[:shopSumCurrencyPaycash]
    shopSumBankPaycash      = params[:shopSumBankPaycash]
    paymentDatetime         = params[:paymentDatetime]
    paymentPayerCode        = params[:paymentPayerCode]
    paymentType             = params[:paymentType]


    md5_string = 'paymentAviso;' + orderSumAmount.to_s + ';' + orderSumCurrencyPaycash.to_s + ';' + orderSumBankPaycash.to_s + ';' +
        shopId.to_s + ';' + invoiceId.to_s + ';' + customerNumber.to_s + ';' + $shopPassword.to_s

    md5_new = Digest::MD5.hexdigest(md5_string).upcase

    log = LoggerBd.new
    log.text = 'payment_aviso yandex md5: ' + md5.to_s
    log.save
    log = LoggerBd.new
    log.text = 'payment_aviso bsc md5: ' + md5_new.to_s
    log.save

    code = 0
    massage = 'Успешно'
    if md5 != md5_new
      code = 1
      massage = 'Ошибка авторизации'
    end

    if orderNumber.present?
      order = Order.find(orderNumber)
    elsif customerNumber.present?
      customerNumberTemp = customerNumber
      s = customerNumberTemp[0,1]
      customerNumberTemp[0] = ''
      if s == 'o'
        order = Order.find(customerNumberTemp.to_i)
      else
        user = User.find(customerNumberTemp.to_i)
        if user.present?
          order = user.orders.last(1)
        else
          order = nil
        end
      end
    else
      order = nil
    end

    if order.present?
      if order.performed_datetime.present?
        requestDatetime = order.performed_datetime.strftime("%FT%T%:z")
      end
      if order.status != 2
        order.status = 2
        order.save
  
        log = LoggerBd.new
        log.text = 'payment_aviso requestDatetime: ' + requestDatetime
        log.save

        OrderNotifier.paid(order).deliver
        OrderNotifier.report_paid(order).deliver
      end
    end

    log = LoggerBd.new
    log.text = 'payment_aviso code: ' + code.to_s
    log.save
    #Time.now.now.strftime("%FT%T%:z"),
    @request = {
        'performedDatetime' => requestDatetime,
        'code'              => code,
        'invoiceId'         => invoiceId,
        'shopId'            => '29313'
    }

    respond_to do |format|
      format.xml  { @request}
    end
  end

  # def change_status
  #   #@order = Order.find(params[:id])
  #   #product_params = Hash[params[:field] => params[:value]]
  #   hui = @order
  #
  #   respond_to do |format|
  #     if @order.update(order_params)
  #       format.html { redirect_to @order, notice: 'Order was successfully updated.' }
  #       format.json { head :no_content }
  #     else
  #       format.html { render action: 'edit' }
  #       format.json { render json: @order.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # PATCH/PUT /orders/1
  # PATCH/PUT /orders/1.json
  def update

    if @order.status.to_s != params[:order][:status]

      case params[:order][:status]
        when '2'
          OrderNotifier.paid(@order).deliver
        when '3'
          OrderNotifier.waiting_to_be_sent(@order).deliver
        when '4'
          OrderNotifier.delivered(@order).deliver
        when '5'
          OrderNotifier.canceled(@order).deliver
      end
      @order.status = params[:order][:status].to_i
      @order.save
    end

    respond_to do |format|
      if @order.update(order_params)
        format.html { redirect_to @order, notice: 'Order was successfully updated.' }
        format.js { @order }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
    end

  end

  # DELETE /orders/1
  # DELETE /orders/1.json
  def destroy
    @order.destroy
    respond_to do |format|
      format.html { redirect_to orders_url }
      format.json { head :no_content }
    end
  end

  def fail

  end

  def success

  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_order
      @order = Order.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def order_params
      params.require(:order).permit(:name, :address, :email, :pay_type, :delivery_type, :phone, :comment, :status, :NameOrganization, :InnOrganization)
    end
end
