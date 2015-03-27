class PromosController < ApplicationController

  def toolset_february_23

    @line_item = LineItem.new
    @compare_item = CompareItem.new

    @promo_goods = Product.where(:id => [1227, 1232, 1231, 30828])
    @all_goods = Product.where(:catalog_id => [2330, 2329, 2328], :is_active => true)

    @all_goods = @all_goods.where("updated_price_at IS NOT NULL AND updated_price_at > ?", (DateTime.now - 2.months))

    @all_goods = @all_goods.scoped(:order => "price asc")
  end


  private
  # Use callbacks to share common setup or constraints between actions.
  def set_promo
    @promo = Promo.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def promo_params
    params.require(:promo).permit()
  end
end
