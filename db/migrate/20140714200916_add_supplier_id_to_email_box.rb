class AddSupplierIdToEmailBox < ActiveRecord::Migration
  def change
    add_column :email_boxes, :supplier_id, :integer
  end
end
