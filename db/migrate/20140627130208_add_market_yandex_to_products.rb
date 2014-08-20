class AddMarketYandexToProducts < ActiveRecord::Migration
  def change
    add_column :products, :market_yandex, :boolean, :default => false
  end
end
