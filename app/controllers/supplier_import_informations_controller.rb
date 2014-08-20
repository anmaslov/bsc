class SupplierImportInformationsController < ApplicationController

  include CurrentCart
  before_action :set_cart
  before_action :set_supplier_import_information, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_admin_user!, only: [:edit, :update, :destroy, :new, :create]
  # GET /pages
  # GET /pages.json
  def index
    @supplier_import_informations = SupplierImportInformation.all
  end

  # GET /pages/1
  # GET /pages/1.json
  def show
    @supplier_import_information = SupplierImportInformation.find(params[:id])
    #ReceiverPriceNotifier.receive_regual
    #Price.load_price_regual
    #render 'shared/404', :status => 404 if @page.nil?
  end

  # GET /pages/new
  def new
    @supplier_import_information = SupplierImportInformation.new
  end

  # GET /pages/1/edit
  def edit
  end

  # POST /pages
  # POST /pages.json
  def create
    @supplier_import_information = SupplierImportInformation.new(supplier_import_information_params)

    respond_to do |format|
      if @supplier_import_information.save
        format.html { redirect_to @supplier_import_information, notice: 'Page was successfully created.' }
        format.json { render action: 'show', status: :created, location: @supplier_import_information }
      else
        format.html { render action: 'new' }
        format.json { render json: @supplier_import_information.errors, status: :unprocessable_entity }
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
      if @supplier_import_information.update(supplier_import_information_params)
        format.html { redirect_to @supplier_import_information, notice: 'SupplierImportInformations was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @supplier_import_information.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /pages/1
  # DELETE /pages/1.json
  def destroy
    @supplier_import_information.destroy
    respond_to do |format|
      format.html { redirect_to supplier_import_informations_url }
      format.json { head :no_content }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_supplier_import_information
    @supplier_import_information = SupplierImportInformation.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def supplier_import_information_params
    params.require(:supplier_import_information).permit(:margin, :first_row, :article_column, :title_column, :quantity_column, :price_column, :supplier_id)
  end


end
