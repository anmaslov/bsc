class AddPositionToCatalogs < ActiveRecord::Migration
  def change
    add_column :catalogs, :position, :integer
  end
end
