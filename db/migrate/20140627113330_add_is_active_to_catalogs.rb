class AddIsActiveToCatalogs < ActiveRecord::Migration
  def change
    add_column :catalogs, :is_active, :boolean, :default => false
  end
end
