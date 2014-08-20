class AddEmailAddressToSuppliers < ActiveRecord::Migration
  def change
    add_column :suppliers, :email_address, :string
  end
end
