class PricesController < ApplicationController

  before_action :set_price, only: [:show, :edit, :update, :destroy]

  load_and_authorize_resource except: :create
  skip_authorize_resource :only => [:show, :yandex]


  def index
    @prices = Price.order('updated_at DESC').paginate(:page => params[:page], :per_page => 30)
  end

  def new
    @price = Price.new
  end

  def show
  end

  def create
    @price = Price.new(price_params)

    respond_to do |format|
      if @price.save
        format.html { redirect_to @price, notice: 'price was successfully created.' }
        format.json { render action: 'show', status: :created, location: @price }
      else
        format.html { render action: 'new' }
        format.json { render json: @price.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @price.update(price_params)
        format.html { redirect_to @price, notice: 'price was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @price.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @price.destroy
    respond_to do |format|
      format.html { redirect_to prices_url }
      format.js { @destroy_id }
      format.json { head :no_content }
    end
  end

  def update_price
    @price = Price.find(params[:id])

    respond_to do |format|
      if @price.import
        format.html { redirect_to @price, notice: 'Price was successfully updated.' }
        format.json { render json: @price }
      else
        format.html { render action: 'edit' }
        format.json { render json: @price.errors, status: :unprocessable_entity }
      end
    end
  end

  def yandex
    @products = Product.where(:is_active => true, :market_yandex => true)

    @products = @products.where("updated_price_at IS NOT NULL AND updated_price_at > ?", (DateTime.now - 2.months))

    @catalogs = Catalog.where(:is_active => true)

    @products = @products.where("quantity > ?", 0)

    if params[:price_max]
      @products = @products.where("price <= ?", params[:price_max])
    end

    if params[:price_min]
      @products = @products.where("price >= ?", params[:price_min])
    end

    if params[:limit]
      @products = @products.order('price DESC').limit( params[:limit] )
    end

    respond_to do |format|
      format.yml { @products }
      format.xml { @products }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_price
    @price = Price.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def price_params
    params.require(:price).permit(:file, :supplier, :supplier_import_information, :supplier_id,
                                  :supplier_import_information_id)
  end
  
end
