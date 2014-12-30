module CurrentCompare
  extend ActiveSupport::Concern

  private

  def set_compare
    @compare = Compare.find(session[:compare_id])
  rescue ActiveRecord::RecordNotFound
    @compare = Compare.create
    @compare_item = CompareItem.new
    session[:compare_id] = @compare.id
  end
end