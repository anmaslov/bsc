class ComparesController < ApplicationController
  include CurrentCart
  include CurrentCompare
  before_action :set_cart, only: [:show, :edit, :index]
  before_action :set_compare, only: [:show, :edit, :index]

  #before_action :authenticate_admin_user!, only: [:index]
  rescue_from ActiveRecord::RecordNotFound, with: :invalid_compare

  def index
    @line_item = LineItem.new
    @compare_item = CompareItem.new
    @pages = Page.all
    @characters = []

    @compare.products.each do |product|
      product.characters.each do |character|
        if (@characters.include? character.name) == false
          @characters.push(character.name)
        end
      end
    end
    #@characters.sort_by {|_key, value| value}
  end

  private



    def compare_params
      params.require(:compare).permit()
    end

    def invalid_compare
      logger.error "Attemp to access invalid compare #{params[:id]}"
      redirect_to compares_url, notice: 'Invalid compare'
    end
end

