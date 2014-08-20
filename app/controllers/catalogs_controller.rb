class CatalogsController < ApplicationController
  include CurrentCart

  before_action :authenticate_admin_user!, only: [:edit, :update, :destroy, :new, :create]

  before_action :set_cart
  before_action :set_catalog, only: [:show, :edit, :update, :destroy]
  #before_action :breadcrumb_catalog, only: [:show]
  add_breadcrumb "Каталог", Catalog

  def index
    @catalogs = Catalog.where({:parent_id=>[0, nil]}).order('title ASC')
    add_breadcrumb "index", @catalogs
  end

  def new
    @catalog = Catalog.new
  end

  def show

    @tree = []
    self.breadcrumb(@catalog.parent)
    @subcatalogs = []

    if @catalog.keywords != nil
      if @catalog.keywords.size > 0
        @catalog.keywords += ', '
      end
    else
      @catalog.keywords = ''
    end
    @catalog.keywords += @catalog.title

    while @tree.size > 0
      catalog_item = @tree.pop
      @subcatalogs.push(catalog_item)
      add_breadcrumb catalog_item.title, catalog_item
      @catalog.keywords += ', ' + catalog_item.title
    end
    @line_item = LineItem.new

    @products =  Product.where(:catalog_id => @catalog.id ).paginate(:page => params[:page], :per_page => 30)

  end

  def create
    @catalog = Catalog.new(catalog_params)

    respond_to do |format|
      if @catalog.save
        format.html { redirect_to @catalog, notice: 'Catalog was successfully created.' }
        format.json { render action: 'show', status: :created, location: @catalog }
      else
        format.html { render action: 'new' }
        format.json { render json: @catalog.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @catalog.update(catalog_params)
        format.html { redirect_to @catalog, notice: 'Catalog was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @catalog.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @catalog.destroy
    respond_to do |format|
      format.html { redirect_to catalog_url }
      format.json { head :no_content }
    end
  end

  def breadcrumb (catalog_item)
    if catalog_item != nil
        #add_breadcrumb catalog_item.title, catalog_item
        @tree.push(catalog_item)
        self.breadcrumb(catalog_item.parent)
    end
  end


  private
  # Use callbacks to share common setup or constraints between actions.
  def set_catalog
    if params[:idr]
      @catalogs = Catalog.where({:old_id => params[:idr].to_i})
      @catalog = @catalogs.pop
    else
      @catalog = Catalog.find(params[:id])
    end
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def catalog_params
    params.require(:catalog).permit(:title, :description, :keywords, :content, :image_url, :parent_id, :is_active, :old_id, :product_table, :catalog_table)
  end

end
