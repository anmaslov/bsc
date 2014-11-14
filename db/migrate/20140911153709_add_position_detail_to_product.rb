class AddPositionDetailToProduct < ActiveRecord::Migration
  def change
    add_column :products, :position_detail, :integer
  end
end
