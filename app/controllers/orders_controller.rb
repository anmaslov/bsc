# encoding: utf-8
class OrdersController < ApplicationController #protect_from_forgery with: :null_session
  include CurrentCart
  before_action :set_cart, only: [:new, :create]
  before_action :set_order, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_admin_user!, only: [:index]

  #load_and_authorize_resource except: :create
  #skip_authorize_resource :only => [:show, :check_order, :new, ]

  # GET /orders
  # GET /orders.json
  def index
    @orders = Order.all
  end

  # GET /orders/1
  # GET /orders/1.json
  def show
    if current_user.id != @order.user_id
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
      if @order.save
        OrderNotifier.received(@order).deliver
        OrderNotifier.report(@order).deliver
        Cart.destroy(session[:cart_id])
        session[:cart_id] = nil
        if params[:user].present? and params[:user][:password] != ''
          User.create!({
            :email => @order.email,
            :password => params[:user][:password],
            :password_confirmation => params[:user][:password_confirmation],
            :name => @order.name,
            :address => @order.address,
            :phone => @order.phone
        })
        end
        if @order.pay_type != 'Банковской картой Visa/MasterCard'
          @order.status = 1
          format.html { redirect_to store_url, notice: 'Спасибо за ваш заказ.' }
          format.json { render action: 'show', status: :created, location: @order }
        else
          format.html { render action: 'payment' }
          format.json { render action: 'show', status: :created, location: @order }
        end
      else
        #@cart = current_cart
        @delivery_products = Product.where(:id => [29734, 29735])
        @line_item = LineItem.new
        @compare_item = CompareItem.new
        format.html { render action: 'new' }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
    end
  end

  def payment

  end

  def check_order

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
        shopId.to_s + ';' + invoiceId.to_s + ';' + customerNumber.to_s + ';' + $shopPassword.to_s + ';'

    md5_new = Digest::MD5.hexdigest(md5_string)

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
          code = 100
          massage = 'Отказ в приеме перевода'
        end
      end
    else
      code = 200
      massage = 'Ошибка разбора запроса'
    end

    #ts = order.total_price - orderSumAmount.to_f
    if order.present?
      if order.total_price - orderSumAmount.to_f > -1 and order.total_price - orderSumAmount.to_f < 1
        code = 100
        massage = 'Отказ в приеме перевода'
      end
    elsif code == 0
      code = 100
      massage = 'Отказ в приеме перевода'
    end

    @request = {
        'performedDatetime' => Time.now ,
        'code'              => code,
        'shopId'            => '29313',
        'orderSumAmount'    => orderSumAmount,
        'message'           => massage
    }
    respond_to do |format|
      format.xml  { render :xml => @request}
    end
  end

  def payment_aviso

    requestDatetime = params[:requestDatetime]
    action          = params[:action]
    md5             = params[:md5]
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


    md5_string = 'checkOrder;' + orderSumAmount.to_s + ';' + orderSumCurrencyPaycash.to_s + ';' + orderSumBankPaycash.to_s + ';' +
        shopId.to_s + ';' + invoiceId.to_s + ';' + customerNumber.to_s + ';' + $shopPassword.to_s + ';'

    md5_new = Digest::MD5.hexdigest(md5_string)

    code = 0
    massage = 'Успешно'
    if md5 != md5_new
      code = 1
      massage = 'Ошибка авторизации'
    end

    @request = {
        'performedDatetime' => Time.now,
        'code'              => code,
        'invoiceId'         => invoiceId,
        'shopId'            => '29313'
    }

    respond_to do |format|
      format.xml  { render :xml => @request}
    end
  end

  # PATCH/PUT /orders/1
  # PATCH/PUT /orders/1.json
  def update
    respond_to do |format|
      if @order.update(order_params)
        format.html { redirect_to @order, notice: 'Order was successfully updated.' }
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

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_order
      @order = Order.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def order_params
      params.require(:order).permit(:name, :address, :email, :pay_type, :delivery_type, :phone, :comment)
    end
end
