class SuppliersController < ApplicationController

  include CurrentCart

  before_action :authenticate_admin_user!, only: [:edit, :update, :destroy, :new, :create]

  before_action :set_cart
  before_action :set_supplier, only: [:show, :edit, :update, :destroy]

  def index
    @suppliers = Supplier.all
  end

  def new
    @supplier = Supplier.new
  end

  def show
  end

  def create
    @supplier = Supplier.new(supplier_params)

    respond_to do |format|
      if @supplier.save
        format.html { redirect_to @supplier, notice: 'Supplier was successfully created.' }
        format.json { render action: 'show', status: :created, location: @supplier }
      else
        format.html { render action: 'new' }
        format.json { render json: @supplier.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @supplier.update(supplier_params)
        format.html { redirect_to @supplier, notice: 'Supplier was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @supplier.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @supplier.destroy
    respond_to do |format|
      format.html { redirect_to supplier_url }
      format.json { head :no_content }
    end
  end


  private
  # Use callbacks to share common setup or constraints between actions.
  def set_supplier
    @supplier = Supplier.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def supplier_params
    params.require(:supplier).permit(:title, :description, :subject, :email_id, :product_id)
  end

end
