class AddEmailBoxIdToEmails < ActiveRecord::Migration
  def change
    add_column :emails, :email_box_id, :integer
  end
end
