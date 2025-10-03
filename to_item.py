#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import requests
import json
from datetime import datetime, timezone

XOR_CODE = 23442827791579
MASK_CODE = 2251799813685247
MAX_AID = 1 << 51
ALPHABET = "FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf"
ENCODE_MAP = 8, 7, 0, 5, 1, 3, 2, 4, 6
DECODE_MAP = tuple(reversed(ENCODE_MAP))

BASE = len(ALPHABET)
PREFIX = "BV1"
PREFIX_LEN = len(PREFIX)
CODE_LEN = len(ENCODE_MAP)

def av2bv(aid: int) -> str:
    bvid = [""] * 9
    tmp = (MAX_AID | aid) ^ XOR_CODE
    for i in range(CODE_LEN):
        bvid[ENCODE_MAP[i]] = ALPHABET[tmp % BASE]
        tmp //= BASE
    return PREFIX + "".join(bvid)

def bv2av(bvid: str) -> int:
    assert bvid[:3] == PREFIX

    bvid = bvid[3:]
    tmp = 0
    for i in range(CODE_LEN):
        idx = ALPHABET.index(bvid[DECODE_MAP[i]])
        tmp = tmp * BASE + idx
    return (tmp & MASK_CODE) ^ XOR_CODE


# ----------------- 工具函数 -----------------
def ts_to_iso(ts: int) -> str:
    return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()

def format_duration(seconds: int) -> str:
    m, s = divmod(seconds, 60)
    return f"{m:02d}:{s:02d}"

# ----------------- 转换成目标格式 -----------------
def transform_bilibili(raw: dict) -> dict:
    return {
        "id": f"video_{raw['aid']}",
        "uploader": {
            "id": f"up_{raw['owner']['mid']}",
            "name": raw["owner"]["name"],
            "avatar": raw["owner"]["face"],
            "bio": "",
            "followerCount": None,
            "verified": bool(raw["owner"].get("vip", {}).get("type", 0))
        },
        "videoInfo": {
            "title": raw["title"],
            "videoUrl": f"https://www.bilibili.com/video/{raw['bvid']}",
            "thumbnail": raw["pic"],
            "duration": format_duration(raw["duration"]),
            "publishDate": ts_to_iso(raw["pubdate"]),
            "likeCount": raw["stat"]["like"],
            "description": raw.get("dynamic", "") or raw.get("desc", "")
        },
        "specialtyProduct": {
            "title": "",
            "description": "",
            "tags": []
        },
        "externalLinks": [
            {
                "title": f"{raw['owner']['name']} · B站主页",
                "url": f"https://space.bilibili.com/{raw['owner']['mid']}",
                "type": "profile",
                "platform": "bilibili"
            }
        ],
        "metadata": {
            "createdAt": ts_to_iso(raw["ctime"]),
            "updatedAt": ts_to_iso(raw["pubdate"]),
            "status": "published" if raw["state"] == 0 else "unlisted",
            "category": raw.get("tname_v2", raw.get("tname", "")),
            "region": "",
            "featured": bool(raw.get("honor_reply", {}).get("honor"))
        }
    }

# ----------------- 主函数 -----------------
def main():
    parser = argparse.ArgumentParser(description="输入 BV 或 AV 号，获取 B站视频并转成目标 JSON")
    parser.add_argument("id", help="BV号 或 av号，例如：BV1wbn9zdE53 或 av170001")
    args = parser.parse_args()

    user_input = args.id.strip()

    # 判断是 BV 还是 AV
    if user_input.lower().startswith("bv"):
        aid = bv2av(user_input)
        print(f"[INFO] 输入 BV {user_input} -> av{aid}")
    elif user_input.lower().startswith("av"):
        aid = int(user_input[2:])
        print(f"[INFO] 输入 AV {aid} -> BV {av2bv(aid)}")
    else:
        raise ValueError("输入必须以 BV 或 av 开头")

    # 请求 API
    url = f"https://api.bilibili.com/x/web-interface/view?aid={aid}"
    resp = requests.get(url)
    resp.raise_for_status()
    data = resp.json()

    if data["code"] != 0:
        print("[ERROR] API 返回错误:", data)
        return

    raw = data["data"]
    result = transform_bilibili(raw)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
