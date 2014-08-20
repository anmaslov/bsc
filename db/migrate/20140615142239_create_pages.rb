class CreatePages < ActiveRecord::Migration
  def change
    create_table :pages do |t|
      t.string :title
      t.text :description
      t.text :content
      t.string :keywords

      t.timestamps
    end
  end
end
