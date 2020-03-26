class Comment < ApplicationRecord
  validates :text, presence: true  # 適用してもコメントは非同期では送信可能。保存だけ防止。
  belongs_to :tweet
  belongs_to :user 
end
