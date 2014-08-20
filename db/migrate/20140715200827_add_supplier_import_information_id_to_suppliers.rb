class AddSupplierImportInformationIdToSuppliers < ActiveRecord::Migration
  def change
    add_column :suppliers, :supplier_import_information_id, :integer
  end
end
