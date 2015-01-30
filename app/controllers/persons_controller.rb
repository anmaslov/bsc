class PersonsController < ApplicationController
  include CurrentCart
  include CurrentCompare
  before_action :set_cart
  before_action :set_compare

  def profile
    @user = current_user
  end
end
