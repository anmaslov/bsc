class AddEmailIdToSuppliers < ActiveRecord::Migration
  def change
    add_column :suppliers, :email_id, :integer
  end
end
