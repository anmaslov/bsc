class AddTitleToSupplierImportInformations < ActiveRecord::Migration
  def self.up
    add_column :supplier_import_informations, :title, :string
  end

  def self.down
    remove_column :supplier_import_informations, :title
  end
end