class AddOldIdToCatalogs < ActiveRecord::Migration
  def change
    add_column :catalogs, :old_id, :integer
  end
end
