import { ChangeEvent, FormEvent, useState } from 'react';
import { bvToAv, extractBvid, formatAvId } from '../utils/bilibili';

type ConversionResult = {
  bvid: string;
  avid: bigint;
};

const BvToAvPage = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    setError(null);
    setCopyMessage(null);
    setResult(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCopyMessage(null);

    const bvid = extractBvid(input);
    if (!bvid) {
      setResult(null);
      setError('未能识别 BV 号，请检查输入是否正确。');
      return;
    }

    try {
      const avid = bvToAv(bvid);
      setResult({ bvid, avid });
      setError(null);
    } catch (conversionError) {
      console.error(conversionError);
      setResult(null);
      setError('转换失败，请确认 BV 号是否填写完整。');
    }
  };

  const handleCopy = async () => {
    if (!result) {
      return;
    }

    try {
      await navigator.clipboard.writeText(formatAvId(result.avid));
      setCopyMessage('已复制到剪贴板。');
    } catch {
      setCopyMessage('复制失败，请手动复制。');
    }
  };

  return (
    <div className="bv-converter-page">
      <header className="bv-converter-hero">
        <h1>BV 号转 AV 号</h1>
        <p>
          将 B 站 BV 号快速转换为对应的 AV 号，方便在搜索、跳转或第三方工具中使用。支持粘贴完整视频链接或仅填写
          BV 号。
        </p>
      </header>

      <section className="bv-converter-card" aria-label="BV 转 AV 工具">
        <form className="bv-converter-form" onSubmit={handleSubmit}>
          <label className="bv-converter-label" htmlFor="bv-converter-input">
            输入 BV 号或包含 BV 号的链接
          </label>
          <div className="bv-converter-input-row">
            <input
              id="bv-converter-input"
              name="bv"
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="例如：BV1xx411c7mD 或 https://www.bilibili.com/video/BV1xx411c7mD"
              value={input}
              onChange={handleInputChange}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'bv-converter-error' : undefined}
            />
            <button type="submit" className="bv-converter-submit">
              转换
            </button>
          </div>
        </form>

        {error && (
          <p id="bv-converter-error" className="bv-converter-error" role="alert">
            {error}
          </p>
        )}

        {result && (
          <div className="bv-converter-result" role="status" aria-live="polite">
            <div className="bv-converter-result__item">
              <span className="bv-converter-result__label">标准 BV 号</span>
              <div className="bv-converter-result__value">
                <a
                  className="bv-converter-result__link"
                  href={`https://www.bilibili.com/video/${result.bvid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result.bvid}
                </a>
              </div>
            </div>
            <div className="bv-converter-result__item">
              <span className="bv-converter-result__label">转换结果</span>
              <div className="bv-converter-result__value">
                {formatAvId(result.avid)}
                <button
                  type="button"
                  className="bv-converter-copy"
                  onClick={handleCopy}
                  aria-label="复制 AV 号"
                >
                  复制
                </button>
              </div>
            </div>
            <div className="bv-converter-result__item">
              <span className="bv-converter-result__label">纯数字 AID</span>
              <div className="bv-converter-result__value">
                <a
                  className="bv-converter-result__link"
                  href={`https://api.bilibili.com/x/web-interface/view?aid=${result.avid.toString()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result.avid.toString()}
                </a>
              </div>
            </div>
            {copyMessage && <p className="bv-converter-copy-status">{copyMessage}</p>}
          </div>
        )}
      </section>
    </div>
  );
};

export default BvToAvPage;
