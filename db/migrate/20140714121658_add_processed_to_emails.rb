class AddProcessedToEmails < ActiveRecord::Migration
  def change
    add_column :emails, :processed, :boolean, :default => false
  end
end
