class CreateCharecterTypes < ActiveRecord::Migration
  def change
    create_table :charecter_types do |t|
      t.string :name, :unique => true
      t.integer :type_filtr, :default => 0

      t.timestamps
    end
  end
end
