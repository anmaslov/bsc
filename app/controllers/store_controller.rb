class StoreController < ApplicationController
  include CurrentCart
  include CurrentCompare
  before_action :set_cart
  before_action :set_compare
  def index
    @products = Product.order("updated_at asc").limit(6)
    @recommendation_products = Product.where(:recommendation => true)
    @recommendation_products = @recommendation_products.where("updated_price_at IS NOT NULL AND updated_price_at > ?", (DateTime.now - 2.months))

    @recommendation_products = @recommendation_products.last(6)

    @line_item = LineItem.new
    @compare_item = CompareItem.new
    @news = News.order("updated_at asc").last(10)
    @sliders = Slider.order("updated_at desc").last(10)
    @product_column_2 = true
  end
end