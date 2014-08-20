class AddArticleToProduct < ActiveRecord::Migration
  def change
    add_column :products, :article, :string
  end
end
