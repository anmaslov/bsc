class CreateNews < ActiveRecord::Migration
  def change
    create_table :news do |t|
      t.string :title
      t.integer :news_type
      t.text :description
      t.text :content
      t.string :youtube_url

      t.timestamps
    end
  end
end
