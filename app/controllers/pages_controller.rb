class PagesController < ApplicationController

  include CurrentCart
  include CurrentCompare
  before_action :set_cart, only: [:show, :edit, :new, :index]
  before_action :set_compare, only: [:show, :edit, :new, :index]

  before_action :set_page, only: [:show, :edit, :update, :destroy]
  #before_action :authenticate_admin_user!, only: [:edit, :update, :destroy, :new, :create]

  load_and_authorize_resource except: :create
  skip_authorize_resource :only => [:show, :robots]

  # GET /pages
  # GET /pages.json
  def index
    @pages = Page.all
  end

  # GET /pages/1
  # GET /pages/1.json
  def show
    #Price.update_info_arrow
    #Price.update_info_ekt
    #@page = Page.find(params[:id])
    #ReceiverPriceNotifier.receive_regual
    #Product.re_cache
    #Price.load_price_regual
    #puts 'update info'
    #ReportMailer.content_manager_for_the_day

    #products = Product.where(:supplier_id => 4).destroy_all

    #order = Order.all.destroy_all

    render 'shared/404', :status => 404 if @page.nil?
  end

  # GET /pages/new
  def new
    @page = Page.new
  end

  # GET /pages/1/edit
  def edit
  end

  # POST /pages
  # POST /pages.json
  def create
    @page = Page.new(page_params)

    respond_to do |format|
      if @page.save
        format.html { redirect_to @page, notice: 'Page was successfully created.' }
        format.json { render action: 'show', status: :created, location: @page }
      else
        format.html { render action: 'new' }
        format.json { render json: @page.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /pages/1
  # PATCH/PUT /pages/1.json
  def update

    #pages = params[:pages]
    #quantity = line_item[:quantity].to_i

    #@line_item[:quantity] = quantity

    respond_to do |format|
      if @page.update(page_params)
        format.html { redirect_to @page, notice: 'Page was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @page.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /pages/1
  # DELETE /pages/1.json
  def destroy
    @page.destroy
    respond_to do |format|
      format.html { redirect_to pages_url }
      format.json { head :no_content }
    end
  end

  def robots
    respond_to :text
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_page
      @page = Page.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def page_params
      params.require(:page).permit(:title, :url, :description, :content, :keywords)
    end
end
