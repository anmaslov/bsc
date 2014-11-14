class AddAncestryToCatalogs < ActiveRecord::Migration
  def change
    add_column :catalogs, :ancestry, :string
  end
end
