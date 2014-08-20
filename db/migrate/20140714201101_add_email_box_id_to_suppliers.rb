class AddEmailBoxIdToSuppliers < ActiveRecord::Migration
  def change
    add_column :suppliers, :email_box_id, :integer
  end
end
