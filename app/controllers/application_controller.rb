class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

  #def after_sign_in_path_for(resource)
  #  current_user_path
  #end

  def after_sign_in_path_for(resource)
    request.referrer || request.env['omniauth.origin'] || stored_location_for(resource) || root_url
  end

  include CurrentCart
  include CurrentCompare
  before_action :set_cart
  before_action :set_compare

  def after_sign_out_path_for(resource_or_scope)
    request.referrer
  end

  def authenticate_admin_user!
    authenticate_user!
    unless current_user.admin?
      flash[:alert] = "This area is restricted to administrators only."
      redirect_to root_path
    end
  end

  def current_admin_user
    return nil if user_signed_in? && !current_user.admin?
    current_user
  end


  rescue_from CanCan::AccessDenied do |exception|
    flash[:error] = exception.message
    redirect_to root_url
  end

end
