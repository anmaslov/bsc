class ProductsController < ApplicationController
  include CurrentCart
  include CurrentCompare
  before_action :set_cart
  before_action :set_compare

  before_action :set_product, only: [:show, :edit, :update, :destroy]

  load_and_authorize_resource except: :create
  skip_authorize_resource :only => [:show, :search, :countfiltr]

  # before_filter :load_attachable

  # GET /products
  # GET /products.json
  def index
    @products = Product.where('id NOT IN (SELECT DISTINCT(product_id) FROM details) AND price <= 1500 AND price > 1000 AND supplier_id <> 2').order('is_active, updated_at ASC').paginate(:page => params[:page], :per_page => 30)
  end

  # GET /products/1
  # GET /products/1.json
  def show

    if (@product.is_active == false) and ((can? :manage, @product) == false)
      redirect_to @product.catalog, notice: 'Продукт временно не доступен'
    end

    @tree = []
    self.breadcrumb(@product.catalog)
    @subcatalogs = []

    # while @tree.size > 0
    #   catalog_item = @tree.pop
    #   @subcatalogs.push(catalog_item)
    #   add_breadcrumb catalog_item.title, catalog_item
    # end

    if @product.keywords != nil
      if @product.keywords.size > 0
        @product.keywords += ', '
      end
    else
      @product.keywords = ''
    end
    @product.keywords += @product.title

    while @tree.size > 0
      catalog_item = @tree.pop
      @subcatalogs.push(catalog_item)
      add_breadcrumb catalog_item.title, catalog_item
      @product.keywords += ', ' + catalog_item.title
    end

    @line_item = LineItem.new
    @compare_item = CompareItem.new
  end

  # GET /products/new
  def new
    @product = Product.new

    if params[:catalog_id].present?
      @product.catalog_id = params[:catalog_id]
    end

    report = Report.new
    report.user = current_user
    report.product = @product
    report.type_action = Report.create_open
    report.save

  end

  # GET /products/1/edit
  def edit
    #@product = @attachable.Product.find(params[:id])

    report = Report.new
    report.user = current_user
    report.product = @product
    report.type_action = Report.edit_open
    report.save

    @characters = @product.characters
  end

  # POST /products
  # POST /products.json
  def create
    @product = Product.new(product_params)

    respond_to do |format|
      if @product.save

        report = Report.new
        report.user = current_user
        report.product = @product
        report.type_action = Report.create_save
        report.save

        format.html { redirect_to edit_product_path @product, scrollto: 'imgs' }
        format.json { render action: 'show', status: :created, location: @product }
      else
        format.html { render action: 'new' }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /products/1
  # PATCH/PUT /products/1.json
  def update
    characters_params = params[:product][:characters]
    if !characters_params.nil?
      characters_params.each do |key, characters_param|
        if characters_param.is_a?(Hash)
          if characters_param[:name].to_s.size > 0 and characters_param[:value].to_s.size > 0
            if key.include? 'new'
              i = 0
              characters_param[:name].each do |key|
                character = Character.new
                character.name = characters_param[:name][i]

                character_type = CharecterType.find_or_create_by(name: character.name)
                character.charecter_type_id = character_type.id

                character.value = characters_param[:value][i]
                character.product_id = @product.id
                if character.name.to_s.size > 0 and character.value.to_s.size > 0
                  character.save
                end
                i = i + 1
              end
            elsif key.to_i > 0
              character = Character.find(key.to_i)
              character.name = characters_param[:name]
              character.value = characters_param[:value]
              character.product_id = @product.id
              character.save
            end
          end
          if characters_param[:_destroy].to_i == 1
            character = Character.find(key.to_i)
            character.destroy
          end
        end
      end
    end

    brand_id = params[:product][:brand_id].to_i
    brand_name = params[:product][:brand]
    if brand_name != ""
      brand = Brand.where("lower(title) = ?", brand_name.mb_chars.downcase).first
      if brand.nil?
        brand = Brand.new
        brand.title = brand_name
        brand.save
      end
    elsif brand_id != 0 and brand_name == ""
      if brand_id != 0
        brand = Brand.find(brand_id)
      end
      if brand.title != brand_name and brand_name != ""
        brand = Brand.where("lower(title) = ?", brand_name.mb_chars.downcase).first
        if brand.nil?
          brand = Brand.new
          brand.title = brand_name
          brand.save
        end
      end
    else
      brand_name =  "NoName"
      brand = Brand.where("lower(title) = ?", brand_name.mb_chars.downcase).first
      if brand.nil?
        brand = Brand.new
        brand.title = brand_name
        brand.save
      end
    end
    params[:product][:brand_id] = brand.id
    respond_to do |format|
      if @product.update(product_params)

        report = Report.new
        report.user = current_user
        report.product = @product
        report.type_action = Report.edit_save
        report.save

        format.html { redirect_to @product, notice: 'Product was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /products/1
  # DELETE /products/1.json
  def destroy
    # @product = @attachable.assets.find(params[:id])

    report = Report.new
    report.user = current_user
    report.product = @product
    report.type_action = Report.delete
    report.save

    @product.destroy
    respond_to do |format|
      format.html { redirect_to products_url }
      format.json { head :no_content }
    end
  end

  def who_bought
    @product = Product.find(params[:id])
    @latest_order = @product.orders.order(:updated_at).last
    if stale?(@latest_order)
      respond_to do |format|
        format.atom
      end
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
    @product = Product.find(params[:id])
    product_params = Hash[params[:field] => params[:value]]
    respond_to do |format|
      if @product.update(product_params)
        format.html { redirect_to @product, notice: 'Product was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  def search
    @query = params[:query].split(/'([^']+)'|"([^"]+)"|\s+|\+/).reject{|x| x.empty?}.map{|x| x.inspect }*' && '
    @products = ThinkingSphinx.search @query, :classes => [Product], :conditions => {:is_active => 1}, :limit => 5
    @total_found = @products .total_entries
    @line_item = LineItem.new
    @compare_item = CompareItem.new
    @query = params[:query]
    #@artists.run
    respond_to do |format|
      format.js #search.js.erb
    end
  end

  def countfiltr

    filtr_data = params[:filtr_data]

    price_filter_minimum = filtr_data[:price_filter_minimum].gsub(' ', "").to_f
    price_filter_maximum = filtr_data[:price_filter_maximum].gsub(' ', "").to_f
    catalog_id = filtr_data[:catalog_id]
    characters = filtr_data[:characters]
    brands = filtr_data[:brands]
    @url = filtr_data.to_query('filtr_data')

    @products = Product.find_by_sql("SELECT products.id
        FROM products
        LEFT JOIN suppliers ON products.supplier_id = suppliers.id
        WHERE products.catalog_id = " + catalog_id.to_s + "
        AND (
        products.price + ( products.price * suppliers.margin ) / 100
        ) >= " + price_filter_minimum.to_s + "/1.035
        AND (
        products.price + ( products.price * suppliers.margin ) /100
        ) <= " + price_filter_maximum.to_s + "/1.035
        AND products.is_active = 1"
    ).map(&:id).uniq

    @products = Product.where("id IN(?)", @products)

    # @products = Product.where("catalog_id = ? AND price >= ? AND price <= ? AND is_active = 1",
    #                           catalog_id,
    #                           price_filter_minimum,
    #                           price_filter_maximum
    # )
    if brands.present?
      @products = @products.where("brand_id IN(?)",
                                  brands
      )
    end

    if characters.present?
      characters.each {|index, item|
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

    @count = @products.all.size

  end

  # def load_attachable
  #   resource, id = request.path.split('/')[1, 2]
  #   @attachable  = resource.singularize.classify.constantize.find(id)
  # end

  def normalization_of_titles
    @products = Product.where(:is_active => true, :market_yandex => true)
  end

  def rename_title
    @product = Product.find(params[:product_id])

    respond_to do |format|
      if @product.update(:title => params[:new_title])
        format.html { redirect_to @product, notice: 'Product was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_product
      @product = Product.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def product_params
      params.require(:product).permit(:title, :article, :description, :image_url, :price, :catalog_id, :is_active, :image, :_destroy, :value, :imgs, :characters, :brand_id, :content, :reports)
    end
end