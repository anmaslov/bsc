class CatalogsController < ApplicationController
  include CurrentCart
  include CurrentCompare
  before_action :set_cart
  before_action :set_compare
  #before_action :authenticate_admin_user!, only: [:edit, :update, :destroy, :new, :create]

  load_and_authorize_resource except: :create
  skip_authorize_resource :only => [:show, :index]

  before_action :set_catalog, only: [:show, :edit, :update, :destroy]
  #before_action :breadcrumb_catalog, only: [:show]
  add_breadcrumb "Каталог", Catalog

  def index
    @catalogs = Catalog.roots
    @compare_item = CompareItem.new
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
    @compare_item = CompareItem.new


    if params[:filtr_data].present?
      @filtr_data = params[:filtr_data]
      @price_filter_minimum = @filtr_data[:price_filter_minimum].sub(' ', "").to_f
      @price_filter_maximum = @filtr_data[:price_filter_maximum].sub(' ', "").to_f
      @characters = @filtr_data[:characters]
      if @filtr_data[:brands].present?
        @brands_filter = @filtr_data[:brands].map { |i| i.to_i }
      end
      @products = Product.where("catalog_id = ? AND price >= ? AND price <= ? AND is_active = 1",
                                @catalog.id,
                                @price_filter_minimum,
                                @price_filter_maximum
      )



      if @brands_filter.present?
        @products = @products.where("brand_id IN(?)",
                                    @brands_filter
        )
      end

      if @characters.present?
        @characters.each {|index, item|
          char = Character.find(index)
          if char.character_type.type_filtr == 0
            values = Character.where(:product_id => item).map(&:value).uniq
            @products = @products.where("id IN (?)",
                                        Character.where(:charecter_type_id => char.charecter_type_id,
                                                        :value => values).map(&:product_id).uniq)
          elsif char.character_type.type_filtr == 1
            @products = @products
            .where("id IN (?)",
                   Character.select("*, CAST( REPLACE( `value` , ',', '.' ) AS DECIMAL( 5, 2 ) ) AS `value_float`")
                   .where("charecter_type_id = ? AND CAST( REPLACE( `value` , ',', '.' ) AS DECIMAL( 5, 2 ) ) >= ? AND CAST( REPLACE( `value` , ',', '.' ) AS DECIMAL( 5, 2 ) ) <= ?",
                          char.charecter_type_id,
                          item[:minimum],
                          item[:maximum]
                   ).map(&:product_id).uniq)
          end
        }
      end

    else
      @products =  Product.where(:catalog_id => @catalog.id, :is_active => true)
    end

    if params[:order].present?
      order = params[:order]
      @products = @products.scoped(:order => order + " asc")
    end
    @products = @products.paginate(:page => params[:page], :per_page => 30)

    @all_products =  Product.where(:catalog_id => @catalog.id, :is_active => true)

    @price_min = @all_products.minimum(:price)
    @price_max = @all_products.maximum(:price)

    brand_ids = @all_products.map(&:brand_id).uniq
    if @all_products.size > 0 and brand_ids.first.present?
      @brands = Brand.find(brand_ids)
    else
      @brands = []
    end

    @characters_names = []
    @characters = []

    @all_products.each do |product|
      product.characters.each do |character|
        if character.character_type.present? and ((@characters_names.include? character.character_type.name) == false)
          @characters_names.push(character.character_type.name)
          @characters.push(character)
        end
      end
    end



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
    parent = @catalog.parent
    @destroy_id = @catalog.id
    @catalog.destroy
    respond_to do |format|
      if !parent.nil?
        format.html { redirect_to parent }
      else
        format.html { redirect_to catalogs_url }
      end
      format.js { @destroy_id }
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

  def change_ajax
    @catalog = Catalog.find(params[:id])
    catalog_params = Hash[params[:field] => params[:value]]
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
    params.require(:catalog).permit(:title, :description, :keywords, :content, :parent_id, :product_table)
  end

end
