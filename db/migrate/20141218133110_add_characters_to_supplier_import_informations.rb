class AddCharactersToSupplierImportInformations < ActiveRecord::Migration
  def self.up
    add_column :supplier_import_informations, :characters_title, :string
    add_column :supplier_import_informations, :characters, :string
    add_column :supplier_import_informations, :product_id, :integer
    add_column :supplier_import_informations, :bar_code, :integer
    add_column :supplier_import_informations, :unit, :integer
  end

  def self.down
    remove_column :supplier_import_informations, :characters_title
    remove_column :supplier_import_informations, :characters
    remove_column :supplier_import_informations, :product_id
    remove_column :supplier_import_informations, :bar_code
    remove_column :supplier_import_informations, :unit
  end
end