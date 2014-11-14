class AddIsProcessedToProducts < ActiveRecord::Migration
  def self.up
    add_column :products, :is_processed, :boolean, :default => false
  end

  def self.down
    remove_column :products, :is_processed
  end
end
