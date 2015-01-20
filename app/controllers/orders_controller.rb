# encoding: utf-8
class OrdersController < ApplicationController
  include CurrentCart
  before_action :set_cart, only: [:new, :create]
  before_action :set_order, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_admin_user!, only: [:index]
  # GET /orders
  # GET /orders.json
  def index
    @orders = Order.all
  end

  # GET /orders/1
  # GET /orders/1.json
  def show
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

    respond_to do |format|
      if @order.save
        OrderNotifier.received(@order).deliver
        OrderNotifier.report(@order).deliver
        Cart.destroy(session[:cart_id])
        session[:cart_id] = nil
        if params[:user].present? and params[:password] != ''
          User.create!({
            :email => @order.email,
            :password => params[:user][:password],
            :password_confirmation => params[:user][:password_confirmation],
            :name => @order.name,
            :address => @order.address,
            :phone => @order.phone
        })
        end
        format.html { redirect_to store_url, notice: 'Спасибо за ваш заказ.' }
        format.json { render action: 'show', status: :created, location: @order }
      else
        #@cart = current_cart
        format.html { render action: 'new' }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
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
