class StoreController < ApplicationController
  include CurrentCart
  before_action :set_cart
  def index
    @products = Product.order(:title).limit(6)
    @line_item = LineItem.new
  end
end