class CreateCatalogs < ActiveRecord::Migration
  def change
    create_table :catalogs do |t|
      t.string :title
      t.text :description
      t.string :keywords
      t.text :content
      t.string :image_url
      t.integer :parent_id, :default => 0

      t.timestamps
    end
  end
end
