class SearchController < ApplicationController

  include CurrentCart
  include CurrentCompare
  before_action :set_cart
  before_action :set_compare

  def product
    @line_item = LineItem.new
    @compare_item = CompareItem.new

    @query = params[:query].split(/'([^']+)'|"([^"]+)"|\s+|\+/).reject{|x| x.empty?}.map{|x| x.inspect }*' && '
    @products = ThinkingSphinx.search @query, :classes => [Product], :conditions => {:is_active => 1}, :per_page => 30, :page => params[:page]
  end
end
