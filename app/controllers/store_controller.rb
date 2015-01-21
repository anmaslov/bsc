class StoreController < ApplicationController
  include CurrentCart
  include CurrentCompare
  before_action :set_cart
  before_action :set_compare
  def index
    @products = Product.order("updated_at asc").limit(6)
    @recommendation_products = Product.where(:recommendation => true).last(6)
    @line_item = LineItem.new
    @compare_item = CompareItem.new
    @news = News.last(10)
  end
end