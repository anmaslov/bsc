class AddKeywordsToProducts < ActiveRecord::Migration
  def change
    add_column :products, :keywords, :string
  end
end
