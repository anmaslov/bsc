class AddRecommendationToProducts < ActiveRecord::Migration
  def change
    add_column :products, :recommendation, :boolean
  end
end
