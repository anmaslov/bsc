class AddProcessingToEmails < ActiveRecord::Migration
  def change
    add_column :emails, :processing, :boolean, :default => false
  end
end
