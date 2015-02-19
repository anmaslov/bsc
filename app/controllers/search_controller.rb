class SearchController < ApplicationController

  include CurrentCart
  include CurrentCompare
  before_action :set_cart
  before_action :set_compare

  def product
    @line_item = LineItem.new
    @compare_item = CompareItem.new

    #@query = params[:query].split(/'([^']+)'|"([^"]+)"|\s+|\+/).reject{|x| x.empty?}.map{|x| x.inspect }*' && '
    #@query = params[:query].gsub('&&','')
    @query = "#{params[:query].strip.gsub(' ', ' | ')}"
    @products = ThinkingSphinx.search @query, :match_mode => :extended, :classes => [Product], :per_page => 30, :page => params[:page]
    @query = "#{@query.strip.gsub(' | ', ' ')}"
  end
end
