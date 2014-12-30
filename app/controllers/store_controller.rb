class StoreController < ApplicationController
  include CurrentCart
  include CurrentCompare
  before_action :set_cart
  before_action :set_compare
  def index
    @products = Product.order("updated_at asc").limit(6)
    @line_item = LineItem.new
    @compare_item = CompareItem.new
  end
end