Bsc::Application.routes.draw do
  resources :promos do
    collection do
      get :toolset_february_23
    end
  end
  #
  # constraints(host: /^www\./i) do
  #   match '(*any)' => redirect { |params, request|
  #     URI.parse(request.url).tap { |uri| uri.host.sub!(/^www\./i, '') }.to_s
  #   }
  # end

  resources :sliders

  resources :news

  get '/robots.:format' => 'pages#robots'

  get 'order/fail' => 'orders#fail'
  get 'order/success' => 'orders#success'

  get "search/product"
  resources :compare_items

  resources :charecter_types do
    collection do
      get :replace_character
      get :change_type_character
    end
  end
  resources :characters

  resources :compares

  resources :brands

  resources :prices do
    collection do
      get :update_price
      get :yandex
      get :google
    end
  end

  resources :supplier_import_informations

  resources :suppliers

  resources :email_boxes

  resources :emails

  #resources :catalogs

  resources :catalogs do
    collection do
      get :manage
      get :change_ajax

      # required for Sortable GUI server side actions
      post :rebuild
    end
  end

  ActiveAdmin.routes(self)
  resources :pages

  mount RedactorRails::Engine => '/redactor_rails'
  devise_for :users#,  :controllers => { :registrations => "users/registrations" }
  #devise_for :users, :path => '', :path_names => { :sign_in => "login", :sign_out => "logout", :sign_up => "register" }
  resources :users do
    get 'orders', :on => :member
  end
  resources :roles
  get "persons/profile"
  #resources :orders
  resources :orders do
    post :check_order, on: :collection
    get :check_order, on: :collection

    post :change_status, on: :collection

    post :payment_aviso, on: :collection
    get :payment_aviso, on: :collection
    get :success, on: :collection
    get :fail, on: :collection
  end

  resources :line_items

  resources :carts


  resources :uploads

  resources :imgs
  resources :product_imgs

  get "store/index"
  resources :products do
    resources :imgs
    resources :reports
    resources :brands
    get :countfiltr, on: :collection
    get :search, on: :collection
    post :payment, on: :collection
    get :who_bought, on: :member
    get :change_ajax, on: :collection

    get :normalization_of_titles, on: :collection
    get :rename_title, on: :collection
    get :rename_brief_characteristics, on: :collection
  end

  get 'persons/profile', as: 'user_root'



  match '/contact.php' => 'pages#show', :id => 'contacts', :via => [:get]
  match '/about.php' => 'pages#show', :id => 'about', :via => [:get]
  match '/price.php' => 'pages#show', :id => 'price-list', :via => [:get]
  match '/catalog.php' => 'catalogs#show', :via => [:get]
  match '/vacancy.php' => 'pages#show', :id => 'vacancy', :via => [:get]
  match '/delivery.php' => 'pages#show', :id => 'delivery', :via => [:get]

  match 'catalog.php' => 'catalogs#show', :id => 0, :via => [:get]

  match '/:id' => 'pages#show', :via => [:get], :as => 'pages_show'



  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'
  root 'store#index'
  root to: 'store#index', as: 'store'
  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
