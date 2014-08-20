class CreateSupplierImportInformations < ActiveRecord::Migration
  def change
    create_table :supplier_import_informations do |t|
      t.decimal :margin
      t.integer :first_row
      t.integer :article_column
      t.integer :title_column
      t.integer :quantity_column
      t.integer :price_column
      t.integer :supplier_id

      t.timestamps
    end
  end
end
