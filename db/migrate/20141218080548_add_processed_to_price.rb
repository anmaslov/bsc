class AddProcessedToPrice < ActiveRecord::Migration
  def self.up
    add_column :prices, :processed, :boolean, :default => false
  end

  def self.down
    remove_column :prices, :processed
  end
end