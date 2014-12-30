class AddSupplierImportInformationIdToPrice < ActiveRecord::Migration
  def self.up
    add_column :prices, :supplier_import_information_id, :integer
  end

  def self.down
    remove_column :prices, :supplier_import_information_id
  end
end