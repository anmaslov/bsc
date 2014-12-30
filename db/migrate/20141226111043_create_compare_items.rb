class CreateCompareItems < ActiveRecord::Migration
  def change
    create_table :compare_items do |t|
      t.references :product, index: true
      t.belongs_to :compare, index: true

      t.timestamps
    end
  end
end
