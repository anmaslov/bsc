class AddIndexes < ActiveRecord::Migration
  def self.up
    if !(index_exists? :catalogs, [:parent_id, :is_active, :catalog_table, :product_table], :name => 'index_catalogs_diff')
      add_index :catalogs, [:parent_id, :is_active, :catalog_table, :product_table], :name => 'index_catalogs_diff'
    end
    if !(index_exists? :catalogs, [:parent_id])
      add_index :catalogs, [:parent_id]
    end
    if !(index_exists? :catalogs, [:is_active])
      add_index :catalogs, [:is_active]
    end
    if !(index_exists? :catalogs, [:catalog_table])
      add_index :catalogs, [:catalog_table]
    end
    if !(index_exists? :catalogs, [:product_table])
      add_index :catalogs, [:product_table]
    end

    if !(index_exists? :characters, [:name, :value, :product_id, :charecter_type_id], :name => 'index_characters_diff')
      add_index :characters, [:name, :value, :product_id, :charecter_type_id], :name => 'index_characters_diff'
    end
    if !(index_exists? :characters, [:name])
      add_index :characters, [:name]
    end
    if !(index_exists? :characters, [:value])
      add_index :characters, [:value]
    end
    if !(index_exists? :characters, [:product_id])
      add_index :characters, [:product_id]
    end
    if !(index_exists? :characters, [:charecter_type_id])
      add_index :characters, [:charecter_type_id]
    end

    if !(index_exists? :charecter_types, [:name, :type_filtr], :name => 'index_charecter_types_diff')
      add_index :charecter_types, [:name, :type_filtr], :name => 'index_charecter_types_diff'
    end
    if !(index_exists? :charecter_types, [:name])
      add_index :charecter_types, [:name]
    end
    if !(index_exists? :charecter_types, [:type_filtr])
      add_index :charecter_types, [:type_filtr]
    end

    if !(index_exists? :detailings, [:product_id], :name => 'index_detailings_diff')
      add_index :detailings, [:product_id], :name => 'index_detailings_diff'
    end

    if !(index_exists? :details, [:product_id, :detail_for_id, :position_detail], :name => 'index_details_diff')
      add_index :details, [:product_id, :detail_for_id, :position_detail], :name => 'index_details_diff'
    end
    if !(index_exists? :details, [:product_id])
      add_index :details, [:product_id]
    end
    if !(index_exists? :details, [:detail_for_id])
      add_index :details, [:detail_for_id]
    end
    if !(index_exists? :details, [:position_detail])
      add_index :details, [:position_detail]
    end

    if !(index_exists? :documents, [:product_id], :name => 'index_documents_diff')
      add_index :documents, [:product_id], :name => 'index_documents_diff'
    end

    if !(index_exists? :emails, [:supplier_id], :name => 'index_emails_diff')
      add_index :emails, [:supplier_id], :name => 'index_emails_diff'
    end

    if !(index_exists? :mail_attachments, [:email_id], :name => 'index_mail_attachments_diff')
      add_index :mail_attachments, [:email_id], :name => 'index_mail_attachments_diff'
    end

    if !(index_exists? :orders, [:user_id])
      add_index :orders, [:user_id]
    end

    if !(index_exists? :prices, [:supplier_id, :supplier_import_information_id], :name => 'index_prices_diff')
      add_index :prices, [:supplier_id, :supplier_import_information_id], :name => 'index_prices_diff'
    end
    if !(index_exists? :prices, [:supplier_id])
      add_index :prices, [:supplier_id]
    end
    if !(index_exists? :prices, [:supplier_import_information_id])
      add_index :prices, [:supplier_import_information_id]
    end

    if !(index_exists? :products, [:price, :article, :is_active, :market_yandex, :supplier_id, :detail_for_id, :position_detail, :brand_id, :product_id, :recommendation, :unit], :name => 'index_products_diff')
      add_index :products, [:price, :article, :is_active, :market_yandex, :supplier_id, :detail_for_id, :position_detail, :brand_id, :product_id, :recommendation, :unit], :name => 'index_products_diff'
    end
    if !(index_exists? :products, [:price])
      add_index :products, [:price]
    end
    if !(index_exists? :products, [:article])
      add_index :products, [:article]
    end
    if !(index_exists? :products, [:is_active])
      add_index :products, [:is_active]
    end
    if !(index_exists? :products, [:market_yandex])
      add_index :products, [:market_yandex]
    end
    if !(index_exists? :products, [:supplier_id])
      add_index :products, [:supplier_id]
    end
    if !(index_exists? :products, [:detail_for_id])
      add_index :products, [:detail_for_id]
    end
    if !(index_exists? :products, [:position_detail])
      add_index :products, [:position_detail]
    end
    if !(index_exists? :products, [:brand_id])
      add_index :products, [:brand_id]
    end
    if !(index_exists? :products, [:product_id])
      add_index :products, [:product_id]
    end
    if !(index_exists? :products, [:recommendation])
      add_index :products, [:recommendation]
    end
    if !(index_exists? :products, [:unit])
      add_index :products, [:unit]
    end

    if !(index_exists? :product_imgs, [:product_id], :name => 'index_product_imgs_diff')
      add_index :product_imgs, [:product_id], :name => 'index_product_imgs_diff'
    end

    if !(index_exists? :reports, [:user_id, :product_id, :catalog_id, :page_id, :type_action, :created_at, :updated_at], :name => 'index_reports_diff')
      add_index :reports, [:user_id, :product_id, :catalog_id, :page_id, :type_action, :created_at, :updated_at], :name => 'index_reports_diff'
    end
    if !(index_exists? :reports, [:user_id])
      add_index :reports, [:user_id]
    end
    if !(index_exists? :reports, [:product_id])
      add_index :reports, [:product_id]
    end
    if !(index_exists? :reports, [:catalog_id])
      add_index :reports, [:catalog_id]
    end
    if !(index_exists? :reports, [:page_id])
      add_index :reports, [:page_id]
    end
    if !(index_exists? :reports, [:type_action])
      add_index :reports, [:type_action]
    end
    if !(index_exists? :reports, [:created_at])
      add_index :reports, [:created_at]
    end
    if !(index_exists? :reports, [:updated_at])
      add_index :reports, [:updated_at]
    end

    if !(index_exists? :roles_users, [:role_id, :user_id])
      add_index :roles_users, [:role_id, :user_id]
    end

    if !(index_exists? :sliders, [:news_id, :product_id, :catalog_id], :name => 'index_sliders_diff')
      add_index :sliders, [:news_id, :product_id, :catalog_id], :name => 'index_sliders_diff'
    end
    if !(index_exists? :sliders, [:news_id])
      add_index :sliders, [:news_id]
    end
    if !(index_exists? :sliders, [:product_id])
      add_index :sliders, [:product_id]
    end
    if !(index_exists? :sliders, [:catalog_id])
      add_index :sliders, [:catalog_id]
    end

    if !(index_exists? :suppliers, [:margin])
      add_index :suppliers, [:margin]
    end

    if !(index_exists? :supplier_import_informations, [:supplier_id], :name => 'index_s_import_inf')
      add_index :supplier_import_informations, [:supplier_id], :name => 'index_s_import_inf'
    end
  end

  def self.down
    remove_index :catalogs, :name => 'index_catalogs_diff'
    remove_index :catalogs, [:parent_id]
    remove_index :catalogs, [:is_active]
    remove_index :catalogs, [:catalog_table]
    remove_index :catalogs, [:product_table]

    remove_index :characters, :name => 'index_characters_diff'
    remove_index :characters, [:name]
    remove_index :characters, [:value]
    remove_index :characters, [:product_id]
    remove_index :characters, [:charecter_type_id]

    remove_index :charecter_types, :name => 'index_charecter_types_diff'
    remove_index :charecter_types, [:name]
    remove_index :charecter_types, [:type_filtr]

    remove_index :detailings, :name => 'index_detailings_diff'

    remove_index :details, :name => 'index_details_diff'
    remove_index :details, [:product_id]
    remove_index :details, [:detail_for_id]
    remove_index :details, [:position_detail]

    remove_index :documents, :name => 'index_documents_diff'

    remove_index :emails, :name => 'index_emails_diff'

    remove_index :mail_attachments, :name => 'index_mail_attachments_diff'

    remove_index :orders, [:user_id]

    remove_index :prices, :name => 'index_prices_diff'
    remove_index :prices, [:supplier_id]
    remove_index :prices, [:supplier_import_information_id]

    remove_index :products, :name => 'index_products_diff'
    remove_index :products, [:price]
    remove_index :products, [:article]
    remove_index :products, [:is_active]
    remove_index :products, [:market_yandex]
    remove_index :products, [:supplier_id]
    remove_index :products, [:detail_for_id]
    remove_index :products, [:position_detail]
    remove_index :products, [:brand_id]
    remove_index :products, [:product_id]
    remove_index :products, [:recommendation]
    remove_index :products, [:unit]

    remove_index :product_imgs, :name => 'index_product_imgs_diff'

    remove_index :reports, :name => 'index_reports_diff'
    remove_index :reports, [:user_id]
    remove_index :reports, [:product_id]
    remove_index :reports, [:catalog_id]
    remove_index :reports, [:page_id]
    remove_index :reports, [:type_action]
    remove_index :reports, [:created_at]
    remove_index :reports, [:updated_at]

    remove_index :roles_users, [:role_id, :user_id]

    remove_index :sliders, :name => 'index_sliders_diff'
    remove_index :sliders, [:news_id]
    remove_index :sliders, [:product_id]
    remove_index :sliders, [:catalog_id]

    remove_index :suppliers, [:margin]

    remove_index :supplier_import_informations, :name => 'index_s_import_inf'
  end
end
