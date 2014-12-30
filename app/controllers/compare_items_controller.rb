class CompareItemsController < InheritedResources::Base
  include CurrentCompare
  before_action :set_compare, only: [:create, :update, :destroy]
  before_action :set_compare_item, only: [:show, :edit, :update, :destroy]

  def create
    product = Product.find(params[:product_id])
    if params[:compare_item]
      compare_item = params[:compare_item]
    else
      compare_item = CompareItem.new
    end
    @compare_item = @compare.add_product(product.id, compare_item)

    respond_to do |format|
      if @compare_item.save
        format.html { redirect_to store_url }
        format.js { @current_item = @compare_item }
        format.json { render action: 'show', status: :created, location: @compare_item }
      else
        format.html { render action: 'new' }
        format.json { render json: @compare_item.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy

    @compare_item = CompareItem.find(params[:id])
    @del_id = @compare_item.product.id
    @compare_item.destroy
    respond_to do |format|
      format.html { redirect_to compares_url }
      format.js { }
      format.json { head :no_content }
    end
  end

  private

    def compare_item_params
      params.require(:compare_item).permit(:product_id, :cart_id)
    end

    def set_compare_item
      @compare_item = CompareItem.find(params[:id])
    end

end

